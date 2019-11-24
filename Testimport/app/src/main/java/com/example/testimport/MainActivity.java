package com.example.testimport;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button button=findViewById(R.id.startbutton);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(getApplicationContext(), "버튼누름", Toast.LENGTH_LONG).show(); // 잠깐 뜨는 메세지
                Log.d("처음버튼을","눌렀다"); // 콘솔창에 뜸
                Intent intent=new Intent(MainActivity.this, SecondActivity.class); //intent 사용하여 넘어갈 activity 정함
                startActivity(intent);
            }
        });
    }
}
