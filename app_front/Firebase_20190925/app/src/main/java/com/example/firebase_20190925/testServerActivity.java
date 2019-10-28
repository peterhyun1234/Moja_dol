package com.example.firebase_20190925;

import android.media.Image;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;
import com.example.firebase_20190925.adapter.UserAdapter;
import com.example.firebase_20190925.model.Realdata;
import com.example.firebase_20190925.model.UserModel;
import com.example.firebase_20190925.service.IApiService;
import com.example.firebase_20190925.service.RestClient;
import com.facebook.stetho.Stetho;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class testServerActivity extends AppCompatActivity {
    private ImageView img_home;
    private ImageView img_finder;
    private ImageView img_download;
    private ImageView img_profile;
    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        Stetho.initializeWithDefaults(this);
        setContentView(R.layout.activity_home);

     //   ImageView img=findViewById(R.id.image_test);
        img_home=findViewById(R.id.tab_home);
        img_finder=findViewById(R.id.tab_finder);
        img_download=findViewById(R.id.tab_download);
        img_profile=findViewById(R.id.tab_profile);
     //   Glide.with(testServerActivity.this).load("https://loremflickr.com/320/240/dog").into(img);



        IApiService iApiService=new RestClient("http://49.236.136.213:3000/").getApiService();
        Call<ArrayList<Realdata>> real=iApiService.getrealDataList();
        try {
            real.enqueue(new Callback<ArrayList<Realdata>>() {
                @Override
                public void onResponse(Call<ArrayList<Realdata>> call, Response<ArrayList<Realdata>> response) {
                    if (response.isSuccessful()) {

                        try {
                            //UserAdapter ua = new UserAdapter(response.body());
                            //String tmp=response.body()
                            Log.d("받아온 데이터","성공"+response.body().toString());
                            Log.d("받아오기","성공");
                            // Log.d("받아온 데이터","성공"+response.body().);
                            // Log.d("바디명",""+tmp);
//                            mRecyclerView.setAdapter(ua);
                        }
                        catch(Exception e) {
                            Log.d("예외",""+response.body().toString());
//                            Log.d(mClassName, e.toString());
                        }
                    }
                }

                @Override
                public void onFailure(Call<ArrayList<Realdata>> call, Throwable t) {

                    Log.d("실패", t.getMessage());
                }
            });
        }
        catch(Exception e) {
           // Log.d(mClassName, e.getMessage());
        }
        img_home.setImageResource(R.drawable.tab_home);
        img_home.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d("이미지","홈출력");
            }
        });
        img_finder.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d("이미지","파인더");
            }
        });
        img_download.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d("이미지","다운로드");
            }
        });
        img_profile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d("이미지","프로필");
            }
        });
    }
}
