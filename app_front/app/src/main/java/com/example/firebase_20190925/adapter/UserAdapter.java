package com.example.firebase_20190925.adapter;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.firebase_20190925.R;
import com.example.firebase_20190925.model.UserModel;

import java.util.ArrayList;

public class UserAdapter extends RecyclerView.Adapter<UserViewHolder> {


    private ArrayList<UserModel> mList;

    public UserAdapter(ArrayList<UserModel> list) {
        mList = list;
    }
    @NonNull
    @Override
    public UserViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.test_row, parent, false);
        return new UserViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull UserViewHolder holder, final int position) {

        holder.mUserName.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d("위치확인",""+mList.get(position).getName().toString());
            }
        });
        Glide.with(holder.itemView.getContext())
                .load(mList.get(position).getPicture() + "#" + position + System.currentTimeMillis()) //Glide가 동일한 URL일 때, 캐싱한 것을 보여주기 때문에 각각 URL을 틀리게 하기 위해 position과 현재 시각을 추가함
                .into(holder.mImageView);
        holder.mUserName.setText(mList.get(position).getName());
        holder.mUserEmail.setText(mList.get(position).getEmail());
        holder.mUserPhone.setText(mList.get(position).getPhone());
    }

    @Override
    public int getItemCount() {
        return mList.size();
    }
}